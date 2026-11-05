import bpy, math
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1]
bpy.ops.wm.open_mainfile(filepath=str(ROOT/'source/soft-lotus-editable.blend'))
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=8;scene.cycles.use_denoising=True
scene.render.resolution_percentage=100;scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGB'
cam=scene.camera;cam.data.type='ORTHO'
def point(loc,target):
 cam.location=loc;cam.rotation_euler=(Vector(target)-cam.location).to_track_quat('-Z','Y').to_euler()
floor=bpy.data.objects['Proof floor'];floor.data.materials[0].node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value=(.08,.12,.16,1)
for o in scene.objects:
 if o.name.startswith('Decor_'):o.hide_render=True
petals=[o for o in scene.objects if o.name.startswith('Petal_')]
for o in petals:
 if 'Focus' in o.data.shape_keys.key_blocks:o.data.shape_keys.key_blocks['Focus'].value=0
scene.render.resolution_x=128;scene.render.resolution_y=128
cam.data.ortho_scale=7.4;point((0,-9.5,10.8),(0,0,.8))
out=ROOT/'source/animation';out.mkdir(exist_ok=True)
for frame in range(28):
 if frame<4:bloom=1
 elif frame<12:bloom=(1+math.cos(math.pi*(frame-4)/8))/2
 elif frame<16:bloom=0
 elif frame<24:bloom=(1-math.cos(math.pi*(frame-16)/8))/2
 else:bloom=1
 for o in petals:o.data.shape_keys.key_blocks['Bloom'].value=bloom
 scene.render.filepath=str(out/f'lotus-{frame:02}.png');bpy.ops.render.render(write_still=True)
chosen=bpy.data.objects['Petal_selvedge'];chosen.data.shape_keys.key_blocks['Bloom'].value=1
for o in scene.objects:
 if o.type=='MESH' and o!=floor:o.hide_render=o!=chosen
scene.render.resolution_x=64;scene.render.resolution_y=64;cam.data.ortho_scale=4.1;point((1,-4.8,6),(0,-1.7,.7))
for frame in range(20):
 chosen.location.z=.10*math.sin(frame*math.tau/20);chosen.rotation_euler.z=.045*math.sin(frame*math.tau/20)
 scene.render.filepath=str(out/f'petal-{frame:02}.png');bpy.ops.render.render(write_still=True)

